import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndTodo1722403884494 implements MigrationInterface {
    name = 'UserAndTodo1722403884494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying, "status" integer NOT NULL DEFAULT '1', "authorId" integer, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum" AS ENUM('CREDENTIAL', 'GOOGLE')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "account" character varying, "password" character varying, "email" character varying, "name" character varying NOT NULL, "provider" "public"."user_provider_enum" NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT '3', CONSTRAINT "UQ_4ab2df0a57a74fdf904e0e27086" UNIQUE ("account"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_c56120106977cc14f975726af07" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_c56120106977cc14f975726af07"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
