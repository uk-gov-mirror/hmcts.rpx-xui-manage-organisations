import { Component, Inject, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from 'src/models/environmentConfig.model';
import { AppTitlesModel } from '../../models/app-titles.model';
import { UserNavModel } from '../../models/user-nav.model';
import * as fromRoot from '../../store';

/**
 * Root Component that bootstrap all application.
 * It holds the state for global components (header and footer)
 * It redirects user to correct landing page based on users permissions.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public pageTitle$: Observable<string>;
  public navItems$: Observable<any> ;
  public appHeaderTitle$: Observable<AppTitlesModel>;
  public userNav$: Observable<UserNavModel>;


  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly googleAnalyticsService: GoogleAnalyticsService,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig
  ) {}

  public ngOnInit() {
    // TODO when we run FeeAccounts story, this will get uncommented
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));

    this.pageTitle$ = this.store.pipe(select(fromRoot.getPageTitle));
    this.navItems$ = this.store.pipe(select(fromRoot.getNavItems));
    this.appHeaderTitle$ = this.store.pipe(select(fromRoot.getHeaderTitle));
    this.userNav$ = this.store.pipe(select(fromRoot.getUserNav));

    // no need to unsubscribe as app component is always init.
    this.store.pipe(select(fromRoot.getRouterState)).subscribe(rootState => {
      if (rootState) {
        this.store.dispatch(new fromRoot.SetPageTitle(rootState.state.url));
      }
    });
    this.googleAnalyticsService.init(this.environmentConfig.googleAnalyticsKey);
  }

  public onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromRoot.Logout());
    }
  }
}
