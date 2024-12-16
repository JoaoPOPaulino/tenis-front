import { ResolveFn } from '@angular/router';
import { Tenis } from '../../../models/tenis.model';
import { inject } from '@angular/core';
import { TenisService } from '../../../services/tenis.service';

export const tenisResolver: ResolveFn<Tenis> = (route) => {
  const id = Number(route.paramMap.get('id'));
  if (isNaN(id)) {
    throw new Error('ID inválido');
  }
  return inject(TenisService).findById(id.toString());
};