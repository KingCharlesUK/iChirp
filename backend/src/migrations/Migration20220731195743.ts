import { Migration } from '@mikro-orm/migrations';

export class Migration20220731195743 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "chirps" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "chirps" cascade;');
  }

}
