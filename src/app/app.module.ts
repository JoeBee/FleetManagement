import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TabsModule } from './components/tabs/tabs.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabsModule
  ],
  providers: [],
})
export class AppModule {}
