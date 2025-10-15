import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module'
import { CarModule } from './car/car.module';
import { SeriesModule } from './series/series.module';
import { CollectionItemModule } from './collection-item/collection-item.module';
@Module({
  imports: [UserModule, CarModule, SeriesModule, CollectionItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
