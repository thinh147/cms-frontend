import { Component, OnInit } from '@angular/core';
import { PAGE_SIZE, STATUS_CODE } from 'app/constant/constant';
import { IUser } from 'app/interfaces/model';
import { IDepartmentResponse } from 'app/interfaces/serve-response';
import { HelperService } from 'app/services/helper.service';
import { SubjectService } from 'app/services/subject.service';
import { environment } from 'environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { IdeasService } from '../ideas/services/ideas.service';
import { AddEditSessionComponent } from './components/add-edit-session/add-edit-session.component';

@Component({
  selector: 'spending-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  sessions: IDepartmentResponse[] = [];
  params = {
    key: '',
    page: 0,
    size: PAGE_SIZE
  }
  total = 0;
  date = [];
  user$: Observable<IUser>;
  constructor(
    private ideaService: IdeasService,
    private modalService: BsModalService,
    private subjectService: SubjectService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.user$ = this.subjectService.userInfo;
    this.getSession();
  }

  getSession() {
    this.ideaService.getSession(this.params).subscribe(res => {
      if (res.code === STATUS_CODE.SUCCESS) {
        const { items, total } = res.data;
        this.sessions = items;
        this.total = total;
      }
    })
  }
  openModalAddEdit(index: number = -1, session: IDepartmentResponse = {} as IDepartmentResponse) {
    const modal = this.modalService.show(AddEditSessionComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        index,
        data: session
      }
    });
    modal.content.onClose.subscribe(res => {
      if (res) {
        index !== -1
          ? this.sessions.splice(index, 1, res)
          : this.sessions.unshift(res)
        this.getSession();
        this.helperService.showSuccess('', 'Action success!!!');
      }
      modal.hide();
    })
  }
  downloadZip() {
    const [startDate, endDate] = this.date as Date[];
    const { roles } = this.subjectService.userInfo.getValue();
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      role: roles
    }
    window.open(`${environment.apiUrl}ideas/download-zip?${new URLSearchParams(params).toString()}`);
  }
  pageChanged($event: PageChangedEvent) {
    this.params.page = $event.page - 1;
    this.getSession();
  }
  exportExcel(id: number) {
    const params = {
      departmentId: id + '',
      sortBy: 'COMMENT'
    };
    const url = `${environment.apiUrl}ideas/export-all?${new URLSearchParams(params).toString()}`;
    window.open(url);
  }
}
