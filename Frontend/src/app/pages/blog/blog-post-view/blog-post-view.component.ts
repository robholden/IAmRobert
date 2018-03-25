import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Post } from '../../../models/post';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../app.config';
import { AuthService } from '../../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/post.service';
import { ToastService } from '../../../services/toast.service';

import * as marked from 'marked';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.component.html',
  styleUrls: ['./blog-post-view.component.css'],
  providers: [PostService, ToastService]
})
export class BlogPostViewComponent implements OnInit {
  post: Post;
  loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _title: Title,
    private _postService: PostService,
    public config: AppConfig,
    public auth: AuthService
  ) { 

    // Set page title
    this._route.params.subscribe(
      params => {

        // Stop if there's no post provided
        if (!params.slug) return this.loading = false;

        // Call api for given post
        _postService.get(params.slug).subscribe(
          (post: Post) => {
            this.post = post;
            this._title.setTitle(`${ this.config.siteTitle } » ${ this.post.slug }`);
            this.loading = false;     
            
            this.post.body = marked(this.post.body || '');
          },
          (error) => this.loading = false
        )

      }
    );

  }

  ngOnInit() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });
  }

}
