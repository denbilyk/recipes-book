import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData(): void {
    this.dataStorageService.saveRecipes();
  }

  onFetchRecipes(): void {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
