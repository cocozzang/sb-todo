import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCascadeRemove1726973988026 implements MigrationInterface {
    name = 'UserCascadeRemove1726973988026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_c56120106977cc14f975726af07"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_c56120106977cc14f975726af07" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_c56120106977cc14f975726af07"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_c56120106977cc14f975726af07" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
