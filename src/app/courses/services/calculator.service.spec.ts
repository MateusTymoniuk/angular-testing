import { CalculatorService } from './calculator.service';
import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {

  let calculator: CalculatorService,
    loggerSpy: any;

  // SETUP
  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }]
    });

    calculator = TestBed.get(CalculatorService);

  });

  it('Should add two numbers', () => {

    // EXECUTION
    const result = calculator.add(1, 2);

    // ASSERTIONS
    expect(result).toBe(3, 'Unexpected addition result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);

  });

  it('Should subtract two numbers', () => {

    const result = calculator.subtract(4, 2);

    expect(result).toBe(2, 'Unexpected subtraction result');
  });
});
