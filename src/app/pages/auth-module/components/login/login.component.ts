import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { STATUS_CODE, STORAGE_KEY } from 'app/constant/constant';
import { IUserAuthResponse, ServerResponse } from 'app/interfaces/serve-response';
import { ApiService } from 'app/services/api.service';
import { HelperService } from 'app/services/helper.service';
import { SubjectService } from 'app/services/subject.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signIn: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading: boolean = false;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private cookieService: CookieService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', []]
    });
    this.registerForm = this.fb.group({
      usr: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      c_pwd: ['', [Validators.required]],
      name: ['', [Validators.required]],
      position: 'Dev'
    })
  }
  validatePassword(group: FormControl): ValidationErrors | null {
    const password = group.value;
    if (password == '') {
      return { required: true }
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    let getChineseCharac = password ? password.split('').filter(char => /\p{Script=Han}/u.test(char)) : '';
    if (getChineseCharac.length > 0) {
      return { containChineseChar: true };
    }
    if (!regex.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }
  checkConfirmPassword(group: FormGroup): ValidationErrors | null {
    const password = group.get('pwd').value;
    const confirmPassword = group.get('c_pwd').value;

    return password === confirmPassword ? null : { invalidConfirmPassword: true };
  }
  signToggle() {
    this.signIn = !this.signIn;
    this.initForm();
  }
  login() {
    this.helperService.markFormGroupTouched(this.loginForm)
    if (this.loginForm.invalid) return;
    // this.helperService.showFullLoading();
    this.loading = true;
    this.apiService.login(this.loginForm.value).subscribe((res: ServerResponse<IUserAuthResponse>) => {
      // console.log(res);
      this.loading = false;
      this.helperService.hideFullLoading();
      if (res['code'] == STATUS_CODE.SUCCESS) {
        this.success(res.data);
        this.helperService.showSuccess('', 'Login Success!!!');
      }
    }, (error) => {
      this.loading = false;
      this.helperService.hideFullLoading();
    });
  }
  signUp() {
    this.helperService.markFormGroupTouched(this.registerForm);
    if (this.registerForm.invalid) return;
    // this.helperService.showFullLoading();
    const { usr, pwd, name, position } = this.registerForm.value;
    this.loading = true;
    this.apiService.register({
      username: name,
      password: pwd,
      email: usr,
      role: 1,
      position
    }).subscribe((res) => {
      this.helperService.hideFullLoading();
      this.loading = false;
      if (res['code'] == STATUS_CODE.SUCCESS) {
        // this.success(res.data);
        this.helperService.showSuccess('', 'Register Success!!!');
        this.signToggle();
      }
    }, (error) => {
      this.loading = false;
      this.helperService.hideFullLoading();
    });
  }
  success(res: IUserAuthResponse) {
    const { token, username, email, roles, userId } = res;
    const data = {
      username,
      email,
      roles,
      userId
    };
    localStorage.setItem(STORAGE_KEY.USER_DATA, JSON.stringify({
      token: token,
      data
    }));
    this.cookieService.set(STORAGE_KEY.ACCESS_TOKEN, token, 365, '/');
    this.cookieService.set(STORAGE_KEY.USER_INFO, JSON.stringify(data), 365, '/');

    this.subjectService.userInfo.next(data);
    this.router.navigateByUrl('/ideas');
  }
}
