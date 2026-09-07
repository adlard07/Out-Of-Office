import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { BudgetLine, Expense } from "@/lib/types";
import type { ApiBudgetSummary, ApiExpense } from "./dto";
import { mapBudgetLines, mapExpense, toExpenseCreate } from "./map";

/** `/api/v1/trips/{id}/budget` and `/expenses`. */
export const expenses = {
  async budgetLines(tripId: string): Promise<BudgetLine[]> {
    return mapBudgetLines(await apiGet<ApiBudgetSummary>(`/trips/${tripId}/budget`));
  },

  async list(tripId: string): Promise<Expense[]> {
    const rows = await apiGet<ApiExpense[]>(`/trips/${tripId}/expenses`);
    return rows.map(mapExpense);
  },

  async add(tripId: string, expense: Omit<Expense, "id">): Promise<Expense> {
    return mapExpense(
      await apiPost<ApiExpense>(`/trips/${tripId}/expenses`, toExpenseCreate(expense)),
    );
  },

  async update(tripId: string, expenseId: string, patch: Partial<Omit<Expense, "id">>): Promise<Expense> {
    return mapExpense(
      await apiPatch<ApiExpense>(`/trips/${tripId}/expenses/${expenseId}`, {
        ...(patch.amount !== undefined && { amount: patch.amount }),
        ...(patch.category !== undefined && { category: patch.category }),
        ...(patch.description !== undefined && { description: patch.description }),
        ...(patch.date !== undefined && { date: patch.date }),
        ...(patch.location !== undefined && { location: patch.location || null }),
      }),
    );
  },

  remove(tripId: string, expenseId: string): Promise<void> {
    return apiDelete(`/trips/${tripId}/expenses/${expenseId}`);
  },
};
