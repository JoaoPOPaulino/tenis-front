import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Tenis } from "../../../models/tenis.model";
import { TenisService } from "../../../services/tenis.service";

export const tenisResolver: ResolveFn<Tenis> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(TenisService).findById(route.paramMap.get('id')!);
    }