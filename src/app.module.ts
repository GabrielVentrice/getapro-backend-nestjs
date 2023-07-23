import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { GameModule } from './game/game.module';
// import { NecordModule } from 'necord';
// import { IntentsBitField } from 'discord.js';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    GameModule,
    DiscordModule,
  ],
  exports: [ConfigModule],
  providers: [],
})
export class AppModule {}
