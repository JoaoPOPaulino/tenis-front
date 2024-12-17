import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';

export const produtoResolver: ResolveFn<Produto> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const id = Number(route.paramMap.get('id'));

  if (isNaN(id)) {
    throw new Error('ID inválido');
  }

  return inject(ProdutoService).findById(id);
};
