import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [periodResult, unitResult, criteriaResult, assignedSubCriteriasResult] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: '/evaluationperiods/' + params.id,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/units/' + params.unitid,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/parentcriterias/' + params.criteriaId,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: `/subcriteriaassignments/assigned?unitId=${params.unitid}&periodId=${params.id}`,
            cookies
        })
    ]);

    if (!periodResult.ok) throw error(periodResult.data.status, periodResult.data.message);
    if (!unitResult.ok) throw error(unitResult.data.status, unitResult.data.message);
    if (!criteriaResult.ok) throw error(criteriaResult.data.status, criteriaResult.data.message);

    // Filter assigned sub-criterias to only show those belonging to the current parent criteria
    const assignedSubCriterias = assignedSubCriteriasResult.ok 
        ? assignedSubCriteriasResult.data.filter((assignment: any) => 
            criteriaResult.data.subCriterias?.some((sub: any) => sub.id === assignment.subCriteriaId)
          )
        : [];

    return {
        period: periodResult.data,
        unit: unitResult.data,
        parentCriteria: criteriaResult.data,
        subCriterias: criteriaResult.data.subCriterias || [],
        assignedSubCriterias: assignedSubCriterias
    };
};

export const actions = {
    assignSubCriterias: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const subCriteriaId = Number(data.get('subCriteriaId'));

        if (!subCriteriaId) {
            return fail(400, { 
                error: 'Vui lòng chọn một tiêu chí con để gán',
                message: 'Chưa chọn tiêu chí con' 
            });
        }

        const periodId = Number(params.id);
        const unitId = Number(params.unitid);

        // Send single sub-criteria assignment to the backend
        const result = await submission({
            method: 'POST',
            endpoint: '/subcriteriaassignments/assign-unit',
            cookies,
            form: {
                subCriteriaId,
                periodId,
                unitId
            },
            formType: 'obj'
        });

        if (!result.ok) {
            return fail(result.data.status || 500, { 
                error: result.data.message || 'Gán tiêu chí thất bại',
                message: result.data.message || 'Có lỗi xảy ra khi gán tiêu chí'
            });
        }

        return { 
            success: true, 
            message: 'Gán tiêu chí con thành công!'
        };
    }
} satisfies Actions;