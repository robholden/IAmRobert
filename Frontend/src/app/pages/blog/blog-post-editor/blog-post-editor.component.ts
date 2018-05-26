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
  styleUrls: ['./blog-post-editor.component.css']
})
export class BlogPostEditorComponent implements OnInit {
  post: Post;
  loading = true;
  deleting = false;
  saving = false;
  creating = true;
  slug = '';

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
        if (!params.slug) return this.load(new Post());

        // Call api for given post
        _postService.get(params.slug).subscribe(
          (post: Post) => {
            this.creating = false;
            this.load(post);
          },
          (error) => { this.load(new Post()) }
        )

      }
    );

  }

  load(post: Post) {
    this.post = post;
    this.loading = false;
    this.saving = false;

    this._title.setTitle(`${this.config.siteTitle} » ${this.post.slug || 'New'}`);

    if (this.creating)
    {
      this._location.go(`/blog/post/new`);
    }

    this.slug = post.slug;
  }

  save() {

    // Are we updating or creating?
    var method = this.creating ? this._postService.create(this.post) : this._postService.update(this.slug, this.post);

    // Both methods have the same outcomes
    this.saving = true;
    method.subscribe(
      (post: Post) => {
        this._toast.success('Post have been saved successfully!');
        this.load(post);

        if (this.creating)
        {
          this._location.go(`/blog/post/edit/${post.slug}`);
          this.creating = false;
        }
      },
      (error) => {
        this._toast.serverError(error);
        this.saving = false;
      }
    )

  }


  delete() {
    this.deleting = true;

    this._toast.confirm(
      (ok) => {
        if (!ok) return this.deleting = false;

        this._postService.delete(this.post.slug).subscribe(
          (ok) => {
            this._toast.success('Post has been deleted');
            this.creating = true;
            this.load(new Post());
            this.deleting = false;
          },
          (error) => {
            this._toast.serverError(error);
            this.deleting = false;
          }
        );
      },
      'Are you sure you want to delete this post?',
      'Delete',
      'Cancel'
    )
  }

  ngOnInit() {
  }

}
