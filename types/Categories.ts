export type CategoryID = "all" | "painting" | "photo" | "manga" | "game" | "animation";

export const Categories: CategoryID[] = [
    "all", "painting", "photo", "manga", "game", "animation"
]

export const isCategory = (arg: unknown): arg is CategoryID => {
    return typeof arg === "string" && Categories.filter(cat => cat === arg).length > 0;
}