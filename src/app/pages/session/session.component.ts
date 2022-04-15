import { Component, OnInit } from '@angular/core';
import { PAGE_SIZE, STATUS_CODE } from 'app/constant/constant';
import { IDepartmentResponse } from 'app/interfaces/serve-response';
import { SubjectService } from 'app/services/subject.service';
import { environment } from 'environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
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
  constructor(
    private ideaService: IdeasService,
    private modalService: BsModalService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.getSession();
  }

  getSession() {
    this.ideaService.getSession(this.params).subscribe(res => {
      if (res.code === STATUS_CODE.SUCCESS) {
        const { items, total } = res.data;
        this.sessions.push(...items);
        this.total = total;
      }
      console.log('sessions', res);
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
}
