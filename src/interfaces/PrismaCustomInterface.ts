import { Prisma, Image } from '@prisma/client';

export type where = Prisma.ImageWhereInput;
export type findOneArgs = Prisma.ImageFindUniqueArgs;
export type createArgs = Prisma.ImageCreateArgs;
export type updateArgs = Prisma.ImageUpdateArgs;
export type deleteArgs = Prisma.ImageDeleteArgs;

export type findOne = Image;
export type findMany = Image[];
export type create = Image;
export type update = Image;
export type upsert = Image;

export type orderBy =
  | Prisma.ImageOrderByWithRelationInput
  | Prisma.ImageOrderByWithRelationInput[]
  | Record<string, 'asc' | 'desc'>;
export type select = Prisma.ImageSelect | Record<string, boolean>;
export type include = Record<string, boolean>;

export type findManyArgs = {
  skip?: number;
  take?: number;
  where?: where;
  orderBy?: orderBy;
  include?: include;
  select?: select;
};
