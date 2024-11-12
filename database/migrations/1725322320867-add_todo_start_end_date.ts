import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTodoStartEndDate1725322320867 implements MigrationInterface {
    name = 'AddTodoStartEndDate1725322320867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "endDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "provider" SET DEFAULT 'CREDENTIAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "provider" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "startDate"`);
    }

}
