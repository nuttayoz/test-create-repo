/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { SnackbarContentComponent, SnackBarData, TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppStore } from '../states/app.state';
import { SnackbarInfoAction, SnackbarActionTypes, SnackbarWarningAction, SnackbarErrorAction, SnackbarAction } from '../actions/snackbar.actions';
import { AigenFileService } from '../../../../aca-content/src/lib/services/aigen-file.service';

@Injectable()
export class SnackbarEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private translationService: TranslationService,
    private aigenFileService: AigenFileService
  ) {}

  infoEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
        map((action: SnackbarInfoAction) => {
          this.showSnackBar(action, 'adf-info-snackbar');
        })
      ),
    { dispatch: false }
  );

  warningEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SnackbarWarningAction>(SnackbarActionTypes.Warning),
        map((action: SnackbarWarningAction) => {
          this.showSnackBar(action, 'adf-warning-snackbar');
        })
      ),
    { dispatch: false }
  );

  errorEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
        map((action: SnackbarErrorAction) => {
          this.showSnackBar(action, 'adf-error-snackbar');
        })
      ),
    { dispatch: false }
  );

  private showSnackBar(action: SnackbarAction, panelClass: string) {
    const message = this.translate(action.payload, action.params);
    let isUndo = false;
    console.error('snackbar show', message, action.userAction, 'APP.ACTIONS.UNDO');

    let actionName: string = null;
    if (action.userAction) {
      actionName = this.translate(action.userAction.title);
    }
    const snackBarRef = this.snackBar.openFromComponent<SnackbarContentComponent, SnackBarData>(SnackbarContentComponent, {
      ...(action.duration !== undefined && action.duration !== null && { duration: action.duration }),
      panelClass,
      data: {
        message,
        actionLabel: actionName,
        actionIcon: 'close',
        actionIconAriaLabel: 'CLOSE',
        showAction: true,
        callActionOnIconClick: false
      }
    });
    if (action.userAction && action.userAction.title === 'APP.ACTIONS.UNDO') {
      snackBarRef.onAction().subscribe(() => {
        isUndo = true;
        this.store.dispatch(action.userAction.action);
      });
      snackBarRef.afterDismissed().subscribe(() => {
        if (!isUndo) {
          // *|* sync delete event
          this.aigenFileService.deleteFile(action.userAction.action['payload']).subscribe(
            (result) => {
              console.error('return', result);
            },
            (error) => {
              console.error('error', error);
            }
          );
        } else {
          isUndo = false;
        }
      });
    }

    if (action.userAction && action.userAction.title !== 'APP.ACTIONS.UNDO') {
      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(action.userAction.action);
      });
    }
  }

  private translate(message: string, params?: any): string {
    return this.translationService.instant(message, params);
  }
}
