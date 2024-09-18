import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  articles: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const rssFeedUrl = 'https://rss.cnn.com/rss/edition.rss';
    this.getRSSFeed().subscribe((feed: any) => {
      this.articles = feed.articles.slice(0, 5);
    });
  }

  getRSSFeed() {
    return this.http.get('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=8cfca9ae83e34a0383646800d1b73daa')
  }

}
