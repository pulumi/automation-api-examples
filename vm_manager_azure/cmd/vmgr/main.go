package main

import (
	"fmt"
	"os"
)

func main() {
	if err := NewVmgrCmd().Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
