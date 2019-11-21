import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {

  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
      ]
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should retrieve all courses', () => {
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12, 'Incorrect number of courses');
      });

    const req = httpTestingController.expectOne('/api/courses');

    expect(req.request.method).toEqual('GET');

    req.flush({ payload: Object.values(COURSES) });
  });

  it('Should retrieve course by its id', () => {
    coursesService.findCourseById(12)
      .subscribe(course => {
        console.log(course);
        expect(course).toBeTruthy('No course with this id exists');
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[12]);
  });

  it('Should save a new course', () => {

    const changes: Partial<Course> = {
      titles:
      {
        description: 'TestingCourse'
      }
    };

    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');

    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    req.flush(
      {
        ...COURSES[12],
        ...changes
      }
    );
  });

  it('Should return an error if save course fails', () => {

    const changes: Partial<Course> = {
      titles:
      {
        description: 'TestingCourse'
      }
    };

    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('The save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');

    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('Should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe(
      lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      }
    );

    const req = httpTestingController.expectOne(
      request => request.url === '/api/lessons'
    );

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });

  });

});
