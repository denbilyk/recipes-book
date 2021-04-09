import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {ClearError, LoginStart, SignupStart} from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private sub: Subscription;
  private storesSub: Subscription;

  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(private cfr: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {
  }


  ngOnInit(): void {
    this.storesSub = this.store.select('auth').subscribe(state => {
      this.isLoading = state.loading;
      this.error = state.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }


  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new LoginStart({email, password}));
    } else {
      this.store.dispatch(new SignupStart({email, password}));
    }
    form.reset();
  }

  onHandlingError(): void {
    this.store.dispatch(new ClearError());
  }

  private showErrorAlert(error: string): void {
    const comFactory = this.cfr.resolveComponentFactory(AlertComponent);
    const viewContainerRef = this.alertHost.ref;
    viewContainerRef.clear();
    const ref = viewContainerRef.createComponent(comFactory);
    ref.instance.message = error;
    this.sub = ref.instance.close.subscribe(() => {
      this.sub.unsubscribe();
      viewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.storesSub) {
      this.storesSub.unsubscribe();
    }
  }

}
