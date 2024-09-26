import { ContainerOptionsFormat, NormalizeSimple, NormalizeOptions, ParsedContainerOptions } from './types';
export declare function parseOptions<T, R>(options: ContainerOptionsFormat<T>, normalizeSimple: NormalizeSimple<R>, normalizeOptions: NormalizeOptions<T, R>): ParsedContainerOptions<R>;
export declare function getBuildVersion(): string;
export declare function getBuildName(): string | undefined;
export declare function isRequiredVersion(str: string): boolean;
