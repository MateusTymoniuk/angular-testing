import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { COURSES } from '../../../../server/db-data';
import { Course } from '../model/course';

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

});
