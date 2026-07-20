import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Habit, HabitCompletionIn } from './habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
    private backendURL = 'http://localhost:8000/api/habit';
    private platformId = inject(PLATFORM_ID);
    constructor(private http: HttpClient) { };

    private getAuthHeaders() : HttpHeaders {
        if (!isPlatformBrowser(this.platformId)) {
        return new HttpHeaders();
    }
        const token = localStorage.getItem('token');
        return new HttpHeaders({Authorization: `Bearer ${token}`})
        
    }
    addHabit(habitData: Partial<Habit>): Observable<Habit> {

        return this.http.post<Habit>(`${this.backendURL}`,habitData,{headers: this.getAuthHeaders()})
    }
	getHabits(): Observable<Habit[]> {
        return this.http.get<Habit[]>(`${this.backendURL}`,{headers: this.getAuthHeaders()})
    }
    deleteHabit(habitID: number): Observable<unknown> {
        return this.http.delete<unknown>(`${this.backendURL}/${habitID}`,{headers: this.getAuthHeaders()})
    }
    markComplete(habitID: number,completionData:HabitCompletionIn): Observable<unknown> {
        return this.http.post<HabitCompletionIn>(`${this.backendURL}/${habitID}/complete`, completionData,{headers: this.getAuthHeaders()})
    }
}
