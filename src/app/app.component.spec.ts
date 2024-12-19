import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year in footer', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toEqual(currentYear);
  });

  it('should render app title in toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.logo');
    expect(titleElement?.textContent).toContain('Sneaker Paradise');
  });

  it('should have home link in navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const homeLink = compiled.querySelector('a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
  });

  it('should have user menu button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const userMenuButton = compiled.querySelector('button.user-menu');
    expect(userMenuButton).toBeTruthy();
  });
});
