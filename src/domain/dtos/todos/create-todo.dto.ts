
export class CreateTdodoDto {
    private constructor(
        public readonly text: string,



    ) { }

    static create(props: { [key: string]: any }): [string?, CreateTdodoDto?] {
        const { text } = props

        if (!text) return ['Text property is required', undefined];

        return [undefined, new CreateTdodoDto(text)];

    }
}