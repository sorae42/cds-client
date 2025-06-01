<script lang="ts">
    import { Users, Building2, Calendar, UserCheck, ClipboardList, TrendingUp } from 'lucide-svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    
    const stats = [
        {
            title: 'Tổng số đơn vị',
            value: data.summary.totalUnits,
            icon: Building2,
            borderColor: 'border-blue-500'
        },
        {
            title: 'Kỳ đánh giá',
            value: data.summary.totalEvaluationPeriods,
            icon: Calendar,
            borderColor: 'border-green-500'
        },
        {
            title: 'Người dùng',
            value: data.summary.totalUsers,
            icon: Users,
            borderColor: 'border-purple-500'
        },
        {
            title: 'Hội đồng đánh giá',
            value: data.summary.totalReviewCouncils,
            icon: UserCheck,
            borderColor: 'border-orange-500'
        },
        {
            title: 'Tiêu chí đánh giá',
            value: data.summary.totalCriteria,
            icon: ClipboardList,
            borderColor: 'border-indigo-500'
        }
    ];

    // Helper function to get progress bar color based on percentage
    function getProgressColor(percent: number): string {
        if (percent >= 80) return 'bg-green-500';
        if (percent >= 60) return 'bg-yellow-500';
        if (percent >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    }
</script>

<div class="p-8 space-y-8">
    <!-- Statistics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
        {#each stats as stat}
            <div class="p-6 border-b-4 {stat.borderColor} border rounded">
                <div class="flex items-center gap-4 mb-3">
                    <stat.icon class="w-8 h-8 text-surface-600-300" />
                    <p>{stat.title}</p>
                </div>
                <p class="text-4xl font-bold text-surface-900-50">{stat.value}</p>
            </div>
        {/each}
    </div>

    <!-- Current Progress Panel -->
    <div class="card p-6">
        <div class="flex items-center gap-3 mb-6">
            <TrendingUp class="w-6 h-6 text-surface-600-300" />
            <h3 class="h3">Tiến độ đánh giá hiện tại</h3>
        </div>

        {#if data.currentProgress && data.currentProgress.length > 0}
            <div class="space-y-4">
                {#each data.currentProgress as period}
                    <div class="p-4 border border-surface-300-600 rounded-lg">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-semibold text-surface-900-50">{period.name}</h4>
                                <p class="text-sm text-surface-600-400">
                                    {period.completedUnits}/{period.totalUnits} đơn vị đã hoàn thành
                                </p>
                            </div>
                            <div class="text-right">
                                <span class="text-2xl font-bold text-surface-900-50">{period.progressPercent}%</span>
                            </div>
                        </div>
                        
                        <!-- Progress Bar -->
                        <div class="w-full bg-surface-200-700 rounded-full h-3">
                            <div 
                                class="h-3 rounded-full transition-all duration-300 {getProgressColor(period.progressPercent)}"
                                style="width: {period.progressPercent}%"
                            ></div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-8">
                <TrendingUp class="w-12 h-12 text-surface-400 mx-auto mb-3" />
                <p class="text-surface-500">Không có kỳ đánh giá nào đang diễn ra</p>
            </div>
        {/if}
    </div>
</div>