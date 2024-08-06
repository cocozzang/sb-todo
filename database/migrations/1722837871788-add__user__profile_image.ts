import { MigrationInterface, QueryRunner } from "typeorm";

export class Add_user_profileImage1722837871788 implements MigrationInterface {
    name = 'Add_user_profileImage1722837871788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_image"`);
    }

}
