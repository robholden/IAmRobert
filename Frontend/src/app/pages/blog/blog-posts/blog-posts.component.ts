import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.css'],
  providers: [PostService]
})
export class BlogPostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  fetching = true;
  orderBy = "";
  orderDir = "ascending"
  value = "";
  page = 1;
  end = false;
  goToLogin = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _postService: PostService,
    public auth: AuthService
  ) { 

    // Show the login page?
    this._route.data.subscribe(data => this.goToLogin = (data.goToLogin === true) && !auth.loggedIn);

    // Look up posts
    this.search();
  }

  search(next: boolean = false) {

    // Show loading is hard lookup
    if (!next)
    {
      this.loading = true;
      this.posts = [];
    }

    // Begin lookup
    this.fetching = true;
    this._postService.search(this.value, this.orderBy, this.orderDir, this.page)
    .subscribe(
      (posts: Post[]) => {
        this.posts = posts;
        this.fetching = false;
        this.loading = false;
        this.end = posts.length === 0;
      },
      (error) => {
        this.fetching = false
        this.loading = false
      }
    );

  }

  ngOnInit() {
  }

}
