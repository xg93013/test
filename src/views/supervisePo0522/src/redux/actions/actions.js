export const IS_LOADING = "IS_LOADING"; ///加载动画

export function changeLoading(isLoading){
    return {
        type: IS_LOADING,
        isLoading
    }
}