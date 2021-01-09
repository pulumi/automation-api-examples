export declare class Cidr32Block {
    readonly startIpAddressInclusive: number;
    readonly subnetMaskLeading1Bits: number;
    readonly endIpAddressExclusive: number;
    /** Do not call directly.  Use the static factory methods to generate a cidr block */
    constructor(startIpAddressInclusive: number, subnetMaskLeading1Bits: number);
    /**
     * Returns a cidr block given notation like "a.b.c.d/n"
     */
    static fromCidrNotation(cidr: string): Cidr32Block;
    nextBlock(): Cidr32Block;
    toString(): string;
}
export declare function getIPv4Address(value: number): string;
