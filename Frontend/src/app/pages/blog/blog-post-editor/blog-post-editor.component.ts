import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Post } from '../../../models/post';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../app.config';
import { AuthService } from '../../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/post.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-blog-post-editor',
  templateUrl: './blog-post-editor.component.html',
  styleUrls: ['./blog-post-editor.component.css'],
  providers: [PostService, ToastService]
})
export class BlogPostEditorComponent implements OnInit {
  post: Post;
  loading = true;
  saving = false;
  creating = true;

  constructor(
    private _route: ActivatedRoute,
    private _title: Title,
    private _postService: PostService,
    private _toast: ToastService,
    private _location: Location,
    public config: AppConfig,
    public auth: AuthService
  ) { 

    // Set page title
    this._route.params.subscribe(
      params => {

        // Stop if there's no post provided
        if (!params.slug) {
          this.post = new Post();
          return this.loading = false;
        }

        // Call api for given post
        _postService.get(params.slug).subscribe(
          (post: Post) => this.load(post),
          (error) => this.loading = false
        )

      }
    );

  }

  load(post: Post) {
    console.log(post);

    this.post = post;
    this.loading = false;
    this._title.setTitle(`${ this.config.siteTitle } » ${ this.post.slug }`);

    if (this.creating) {
      this._location.go(`/blog/post/edit/${ post.slug }`);
      this.creating = false;
    }
  }

  save() {

    // Are we updating or creating?
    var method = this.creating ? this._postService.create(this.post) : this._postService.update(this.post);

    // Both methods have the same outcomes
    this.saving = true;
    method.subscribe(
      (post) => {
        this.post = post;
        this.saving = false;
      },
      (error) => {
        this._toast.serverError(error);
        this.saving = false;
      }
    )

  }


  ngOnInit() {
  }

}
