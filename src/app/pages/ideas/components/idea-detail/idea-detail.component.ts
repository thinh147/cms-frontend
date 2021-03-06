import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PAGE_SIZE, STATUS_CODE } from 'app/constant/constant';
import { ICommentResponse, IIdeaDetailResponse, IIdeaResponse } from 'app/interfaces/serve-response';
import { HelperService } from 'app/services/helper.service';
import { SubjectService } from 'app/services/subject.service';
import { IdeasService } from '../../services/ideas.service';

@Component({
  selector: 'spending-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrls: ['./idea-detail.component.scss']
})
export class IdeaDetailComponent implements OnInit {
  ideaDetail: IIdeaDetailResponse = {} as IIdeaDetailResponse;
  idea: IIdeaResponse = {} as IIdeaResponse;
  params = {
    ideaId: -1,
    page: 0,
    size: PAGE_SIZE,
    staffId: -1
  }
  comments: ICommentResponse[] = [];
  totalComments = 0;
  commentText = '';
  loading = false;
  total = 0;
  isAnonymous = true;
  constructor(
    private activeRoute: ActivatedRoute,
    private ideaService: IdeasService,
    private subjectService: SubjectService,
    private helperService: HelperService
  ) {
    const params = this.activeRoute.snapshot.params;
    if (params['sessionId'] && params['id']) {
      this.params.ideaId = params['id'];
      this.idea.departmentId = params['sessionId'];
      this.params.staffId = this.subjectService.userInfo.getValue().userId;
      this.getDetailIdea();
    }
  }

  ngOnInit(): void {
  }

  getDetailIdea() {
    this.ideaService.getDetailIdea(this.params).subscribe(res => {
      if (res.code === STATUS_CODE.SUCCESS) {
        this.ideaDetail = res.data;
        this.idea = {
          ...this.idea,
          ...this.ideaDetail,
          name: this.ideaDetail.ideaName,
          totalComment: this.ideaDetail.totalComment,
          totalLike: this.ideaDetail.totalLike,
          description: this.ideaDetail.description,
          ideaId: this.ideaDetail.ideaId
        };
        this.comments = this.ideaDetail.detailComment.items;
        this.total = this.ideaDetail.detailComment.total;
      }
    })
  }
  getComment() {
    this.ideaService.getDetailIdea(this.params).subscribe(res => {
      if (res.code === STATUS_CODE.SUCCESS) {
        this.helperService.showSuccess('', 'Comment success!!!');
        this.comments.push(...res.data.detailComment.items);
        this.total = res.data.detailComment.total;
      }
    })
  }

  postComment() {
    if (!this.commentText) {
      return;
    }
    const { userId } = this.subjectService.userInfo.getValue();
    this.loading = true;
    this.ideaService.postComment({
      anonymous: this.isAnonymous,
      content: this.commentText,
      ideaId: this.ideaDetail.ideaId,
      staffId: userId
    }).subscribe(res => {
      this.loading = false;
      if (res.code === STATUS_CODE.CREATED) {
        res.data.staffName = this.isAnonymous ? '' : res.data.staffName;
        this.comments.unshift(res.data);
        this.idea.totalComment += 1;
        this.commentText = '';
        this.isAnonymous = true;
      }
    }, err => this.loading = false);

  }
  loadMore() {
    this.params.page += 1;
    this.getComment();
  }
}
