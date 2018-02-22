import { GameDetailComponent } from './components/game-detail/game-detail.component';
import { ThreeDetailComponent } from './components/three-detail/three-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthGuard } from 'app/_helpers/Auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import {HomeDetailComponent} from './components/home-detail/home-detail.component';
import { SettingComponent } from './components/setting/setting.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ThreeComponent } from 'app/components/three/three.component';
import { GameComponent } from 'app/components/game/game.component';
import { MusicComponent } from 'app/components/music/music.component';
import { MusicDetailComponent } from 'app/components/music-detail/music-detail.component';
import { MovieComponent } from 'app/components/movie/movie.component';
import { MovieDetailComponent } from 'app/components/movie-detail/movie-detail.component';
import { CoComponent } from 'app/components/co/co.component';
import { CoDetailComponent } from 'app/components/co-detail/co-detail.component';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { ContactTriComponent } from 'app/components/contact-tri/contact-tri.component';
import { ChatCareComponent } from 'app/components/chat-care/chat-care.component';
import { LeaveMsgComponent } from 'app/components/leave-msg/leave-msg.component';
import { TagihanComponent } from 'app/components/tagihan/tagihan.component';
import { TagihanSummaryComponent } from 'app/components/tagihan-summary/tagihan-summary.component';
import { MoreComponent } from './components/more/more.component';
import { ReloadComponent } from 'app/components/reload/reload.component';
import { PascabayarComponent } from 'app/components/pascabayar/pascabayar.component';
import { RemainingCreditComponent } from 'app/components/remaining-credit/remaining-credit.component';
import { ChatBoxComponent } from 'app/components/chat-box/chat-box.component';
import { BillingComponent } from "app/components/billing/billing.component";
import { SearchResultComponent } from 'app/components/search-result/search-result.component';
import { BillpayComponent } from "app/components/billpay/billpay.component";
import { ShareKoutaComponent } from 'app/components/share-kouta/share-kouta.component';
import { DokuThankuComponent } from 'app/components/doko/doku-thanku/doku-thanku.component';
import { ContinueComponent } from 'app/components/doko/continue/continue.component';
import { ServeyComponent } from 'app/components/servey/servey.component'
import { BannerMoreComponent } from 'app/components/more/banner-more/banner-more.component';
import { PortraitMoreComponent } from 'app/components/more/portrait-more/portrait-more.component';
import { SquareMoreComponent } from 'app/components/more/square-more/square-more.component';
import { RfuMoreComponent } from 'app/components/more/rfu-more/rfu-more.component';

const route: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent },
    { path: 'home', component: HomeComponent },
    { path: 'home-detail', component: HomeDetailComponent },
    { path: 'settings', component: SettingComponent },
    { path: 'email', component: ChangeEmailComponent },
    { path: 'favorit', component: ThreeComponent },
    { path: 'favorit-detail', component: ThreeDetailComponent },
    { path: 'game', component: GameComponent },
    { path: 'game-detail', component: GameDetailComponent },
    { path: 'music', component: MusicComponent },
    { path: 'music-detail', component: MusicDetailComponent },
    { path: 'movie', component: MovieComponent },
    { path: 'movie-detail', component: MovieDetailComponent },
    { path: 'co', component: CoComponent },
    { path: 'co-detail', component: CoDetailComponent },
    { path: 'notification', component: NotificationComponent },
    { path: 'contact-tri', component: ContactTriComponent },
    { path: 'chat-care', component: ChatCareComponent },
    { path: 'leave-msg', component: LeaveMsgComponent },
    { path: 'three', component: ThreeComponent },
    { path: 'three-detail', component: ThreeDetailComponent },
    { path: 'tagihan', component: TagihanComponent },
    { path: 'tagihan-summary', component: TagihanSummaryComponent },
    {path: 'more', component: MoreComponent },
    { path: 'reload', component: ReloadComponent },
    { path: '3pascabayar', component: PascabayarComponent},
    { path: 'remaining-credit', component: RemainingCreditComponent},
    { path: 'chat-box', component: ChatBoxComponent},
    { path: 'billing', component: BillingComponent},
    { path: 'search', component: SearchResultComponent},
    { path: 'billpayComponent', component: BillpayComponent},
    { path: 'ShareKouta', component: ShareKoutaComponent},
    { path: 'ContinueDoku', component: ContinueComponent},
    { path: 'DokuThanku', component: DokuThankuComponent},
    { path: 'survey', component: ServeyComponent},
    { path: 'morebanner', component: BannerMoreComponent},
    { path: 'portraitmore', component: PortraitMoreComponent},
    { path: 'squaremore', component: SquareMoreComponent},
    { path: 'rfumore', component: RfuMoreComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(route)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class AppRoutingModule { }
