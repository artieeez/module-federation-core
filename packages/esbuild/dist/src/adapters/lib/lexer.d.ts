export declare class Lexer {
    input: string;
    pos: number;
    readString(input: string, pos: number): string | null;
    readEscapedChar(): string | null;
    readInt(radix: number, len: number): number | null;
    readHexChar(len: number): number | null;
    readCodePoint(): number | null;
}
