import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Movie, PrismaClient } from '@prisma/client';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private readonly indexName = 'movies';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prisma: PrismaClient,
  ) {}

  async syncAll() {
    const movies = await this.prisma.movie.findMany();
    await this.syncMovies(movies);
    return { count: movies.length };
  }

  async onModuleInit() {
    this.logger.log('Checking Elasticsearch connection...');
    try {
      const exists = await this.elasticsearchService.indices.exists({
        index: this.indexName,
      });

      if (!exists) {
        await this.elasticsearchService.indices.create({
          index: this.indexName,
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text' },
              description: { type: 'text' },
              genres: { type: 'keyword' },
            },
          },
        });
        this.logger.log(`Created index: ${this.indexName}`);
      }
    } catch (error) {
      this.logger.error('Failed to connect to Elasticsearch', error);
    }
  }

  async indexMovie(movie: Movie) {
    try {
      await this.elasticsearchService.index({
        index: this.indexName,
        id: movie.id,
        document: {
          id: movie.id,
          title: movie.title,
          description: movie.description,
          genres: movie.genres,
          image: movie.image,
          rating: movie.rating,
          releaseDate: movie.releaseDate,
        },
      });
      this.logger.log(`Indexed movie: ${movie.id}`);
    } catch (error) {
      this.logger.error(`Failed to index movie: ${movie.id}`, error);
      throw error;
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    if (!query) return [];

    const result = await this.elasticsearchService.search({
      index: this.indexName,
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'description', 'genres'],
          fuzziness: 'AUTO',
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source as Movie);
  }

  async syncMovies(movies: Movie[]) {
    this.logger.log(`Starting sync for ${movies.length} movies...`);
    const body = movies.flatMap((movie) => [
      { index: { _index: this.indexName, _id: movie.id } },
      {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        genres: movie.genres,
        image: movie.image,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
      },
    ]);

    if (body.length === 0) return;

    const result = await this.elasticsearchService.bulk({
      index: this.indexName,
      operations: body,
    });

    if (result.errors) {
      this.logger.error('Failed to sync some movies', result.items);
    } else {
      this.logger.log(`Successfully synced ${movies.length} movies.`);
    }
  }
}
