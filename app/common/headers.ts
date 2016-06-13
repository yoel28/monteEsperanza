import { Headers } from '@angular/http';

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');

if(localStorage.getItem('bearer'))
    contentHeaders.append('Authorization', 'Bearer '+localStorage.getItem('bearer'));
