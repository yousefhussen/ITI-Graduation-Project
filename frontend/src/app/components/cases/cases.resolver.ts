import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CasesService } from '../../shared/services/cases.service';
import { ClientsService } from '../../shared/services/clients.service';

@Injectable({
  providedIn: 'root',
})
export class CasesResolver implements Resolve<any> {
  constructor(
    private caseService: CasesService,
    private clientService: ClientsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return forkJoin({
      cases: this.caseService.getCases(),
      categories: this.caseService.getCategories(),
      grades: this.caseService.getCaseGrade(),
      clients: this.clientService.getClients(),
    }).pipe(
      map((data) => {
        const { cases, categories, grades, clients } = data;
        const enrichedCases = cases.map((caseItem: any) => ({
          ...caseItem,
          categoryName:
            categories.find((cat: any) => cat.id === caseItem.case_category_id)
              ?.name || 'No Category',
          case_grade:
            grades.find((grade: any) => grade.id === caseItem.case_grade_id)
              ?.name || 'No Grade',
          client:
            clients.find((client: any) => client.id === caseItem.client_id) ||
            null,
        }));
        return {
          cases: enrichedCases,
          categories,
          grades,
          clients,
        };
      })
    );
  }
}
