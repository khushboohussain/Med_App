import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'login', loadChildren: './start/login/login.module#LoginPageModule' },
  { path: 'login/password-reset', loadChildren: './start/login/password-reset/password-reset.module#PasswordResetPageModule' },
  { path: 'register', loadChildren: './start/register/register.module#RegisterPageModule' },

  { path: 'admin/employees', loadChildren: './admin/employees/employees.module#EmployeesPageModule' },
  { path: 'admin/employees/employee', loadChildren: './admin/employees/employee/employee.module#EmployeePageModule' },
  { path: 'admin/employers', loadChildren: './admin/employers/employers.module#EmployersPageModule' },
  { path: 'admin/employers/employer', loadChildren: './admin/employers/employer/employer.module#EmployerPageModule' },
  { path: 'admin/settings', loadChildren: './admin/settings/settings.module#SettingsPageModule' },
  { path: 'admin/settings/qualification', loadChildren: './admin/settings/qualification/qualification.module#QualificationPageModule' },

  { path: 'employee/onboarding', loadChildren: './employee/onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'employee/appointments', loadChildren: './employee/appointments/appointments.module#AppointmentsPageModule' },
  { path: 'employee/notifications', loadChildren: './employee/notifications/notifications.module#NotificationsPageModule' },
  { path: 'employee/profile', loadChildren: './employee/profile/profile.module#ProfilePageModule' },
  { path: 'employee/profile/details', loadChildren: './employee/profile/details/details.module#DetailsPageModule' },
  { path: 'employee/profile/qualifications', loadChildren: './employee/profile/qualifications/qualifications.module#QualificationsPageModule' },
  { path: 'employee/appointments/appointment', loadChildren: './employee/appointments/appointment/appointment.module#AppointmentPageModule' },
  { path: 'employee/appointments/ads', loadChildren: './employee/appointments/ads/ads.module#AdsPageModule' },
  { path: 'employee/appointments/ads/ad', loadChildren: './employee/appointments/ads/ad/ad.module#AdPageModule' },
  { path: 'employee/appointments/ads/ad/details', loadChildren: './employee/appointments/ads/ad/details/details.module#DetailsPageModule' },

  { path: 'employer/onboarding', loadChildren: './employer/onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'employer/ads', loadChildren: './employer/ads/ads.module#AdsPageModule' },
  { path: 'employer/notifications', loadChildren: './employer/notifications/notifications.module#NotificationsPageModule' },
  { path: 'employer/profile', loadChildren: './employer/profile/profile.module#ProfilePageModule' },
  { path: 'employer/ads/ad', loadChildren: './employer/ads/ad/ad.module#AdPageModule' },
  { path: 'employer/ads/ad/applications', loadChildren: './employer/ads/ad/applications/applications.module#ApplicationsPageModule' },
  { path: 'employer/ads/ad/applications/application', loadChildren: './employer/ads/ad/applications/application/application.module#ApplicationPageModule' },
  { path: 'employer/ads/ad/applications/confirmed', loadChildren: './employer/ads/ad/applications/confirmed/confirmed.module#ConfirmedPageModule' },
  { path: 'employer/ads/create/step1', loadChildren: './employer/ads/create/step1/step1.module#Step1PageModule' },
  { path: 'employer/ads/create/step2', loadChildren: './employer/ads/create/step2/step2.module#Step2PageModule' },
  { path: 'employer/ads/create/step3', loadChildren: './employer/ads/create/step3/step3.module#Step3PageModule' },
  { path: 'employer/profile/details', loadChildren: './employer/profile/details/details.module#DetailsPageModule' },
  { path: 'employer/profile/payment-methods', loadChildren: './employer/profile/payment-methods/payment-methods.module#PaymentMethodsPageModule' },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
