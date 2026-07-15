import { hash } from "bcryptjs";
import type { MigrationInterface } from "typeorm";
import type { QueryRunner } from "typeorm/browser";
import { env } from "../../env/index.js";

export class CreateTables1779748545908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,

        name VARCHAR(255) NOT NULL,

        username VARCHAR(255) NOT NULL UNIQUE,

        password VARCHAR(255) NOT NULL,
        
        email VARCHAR(255) NOT NULL UNIQUE,
        
        role VARCHAR(255) NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE
          NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        is_active BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE post (
        id SERIAL PRIMARY KEY,

        title VARCHAR(255) NOT NULL,

        content TEXT NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE
          NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        created_by INTEGER NOT NULL,

        updated_at TIMESTAMP WITHOUT TIME ZONE,

        updated_by INTEGER,

        is_active BOOLEAN NOT NULL DEFAULT TRUE,

        CONSTRAINT fk_post_created_by
          FOREIGN KEY (created_by)
          REFERENCES users(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_post_updated_by
          FOREIGN KEY (updated_by)
          REFERENCES users(id)
          ON DELETE SET NULL

      );
    `);

    const hashedPassword = await hash(env.ADMIN_USER_PASSWORD, 10);

    await queryRunner.query(`
    INSERT INTO users (
      username,
      name,
      email,
      password,
      role,
      created_at,
      is_active
    )
    VALUES (
      '${env.ADMIN_USER_USERNAME}',
      '${env.ADMIN_USER_NAME}',
      '${env.ADMIN_USER_EMAIL}',
      '${hashedPassword}',
      'admin',
      NOW(),
      TRUE
    );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE post;
      DROP TABLE users;
    `);
  }
}
