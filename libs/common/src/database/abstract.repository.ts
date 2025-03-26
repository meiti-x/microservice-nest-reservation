import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDoc = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDoc.save()).toJSON() as unknown as TDocument;
  }

  async update(
    filter: FilterQuery<TDocument>,
    document: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const doc = await this.model
      .findOneAndUpdate(filter, document, { new: true })
      .lean<TDocument>(true);

    if (!doc) {
      this.logger.warn('no doc found with this filter: ', filter);
      throw new NotFoundException('document was not found');
    }

    return doc as TDocument;
  }

  async delete(filter: FilterQuery<TDocument>) {
    const doc = await this.model.findOneAndDelete(filter);
    if (!doc) {
      throw new NotFoundException('document was not found');
    }
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const doc = await this.model.findOne(filter).lean(true);

    if (!doc) {
      this.logger.warn('no doc found with this filter: ', filter);
      throw new NotFoundException('document was not found');
    }

    return doc as TDocument;
  }

  async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    const doc = await this.model.find(filter).lean(true);

    if (!doc) {
      this.logger.warn('no doc found with this filter: ', filter);
      throw new NotFoundException('document was not found');
    }

    return doc as TDocument[];
  }
}
