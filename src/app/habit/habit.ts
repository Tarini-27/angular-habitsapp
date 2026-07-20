import { Component, OnInit, ChangeDetectorRef, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 
import { HabitService } from './habit.service';
import { Habit, HabitCompletionIn } from './habit.model';

@Component({
    selector: 'app-habit',
    standalone: true,
    templateUrl: "./habit.html",
    styleUrl: "./habit.css",
    imports: [CommonModule,FormsModule]
})

export class HabitComponent implements OnInit {
    newHabit = {
        name: '',
        frequency: 'Daily',
    };
    habitResponses = signal<Habit[]>([]);
    errormessage = signal('');
    habitmessage = signal('');
    completionData: HabitCompletionIn = {completion_date: new Date().toISOString().split('T')[0]}
    constructor(private habitService: HabitService,private cdr: ChangeDetectorRef) {
    };

    getHabits(): void{
        this.errormessage.set('');
        this.habitmessage.set('');
        this.habitService.getHabits().subscribe({
            next: (response) => {
              console.log("GET response:", response);
                this.habitResponses.set(response)   
                // this.cdr.detectChanges();     
            },
            error: (err) => {
                this.errormessage.set('No Habits found for this user')
                console.log(err)
                // this.cdr.detectChanges();
            }

        })
    };
    ngOnInit(): void{
        this.getHabits()
    };
    addHabit(): void{
        this.errormessage.set('');
        this.habitmessage.set('');
        this.habitService.addHabit({name: this.newHabit.name, frequency: this.newHabit.frequency}).subscribe({
            next: response => {
                this.getHabits()
                // this.cdr.detectChanges(); 
            }
        })
    };
    deleteHabit(habitId: number): void {
        this.errormessage.set('');
        this.habitmessage.set('');
        this.habitService.deleteHabit(habitId).subscribe({
            next: (response) => {
                this.habitResponses.update(habits => habits.filter(h => h.id !== habitId));
                // this.cdr.detectChanges();
                console.log(habitId,"Habit is deleted")    
            },
            error: (err) => {
                this.errormessage.set('Habit deletion failed')
                console.log(err)
                // this.cdr.detectChanges();
            }
        })
    };
    markComplete(habitId: number): void {
        this.errormessage.set('');
        this.habitmessage.set('');
        this.habitService.markComplete(habitId, this.completionData).subscribe({
            next: (response) => {
                this.habitmessage.set("Habit is completed successfully")
                // this.cdr.detectChanges();
                console.log(habitId,"Habit is completed successfully")    
            },
            error: (err) => {
                this.errormessage.set('Habit is already completed: Completion Failed')
                console.log(err.error.detail)
                // this.cdr.detectChanges();
            }
        })
    };
}