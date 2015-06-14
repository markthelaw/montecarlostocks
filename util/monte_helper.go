// monte_helper.go
package util

import (

	"math/rand"
	"time"
	"github.com/markthelaw/GoStatHelper/StatUtil"
)

var r = rand.New(rand.NewSource(time.Now().UnixNano()))

func init(){
	r = rand.New(rand.NewSource(time.Now().UnixNano()))
}

type Stock struct{
	//InitialFund float64
	Mean float64 
	Stdv float64
	Times int 
	Years int 
}


func MonteYears(stockTemp Stock, sum chan [][]float64) ([][]float64){
	 result := make([][]float64, stockTemp.Times)
	totalChannel := make(chan []float64)
	//sumSlice := make([][]float64, times, years)
	for stockTemp.Times>0 {
		go Iterations(stockTemp, totalChannel)
		//fmt.Printf("Hi return is %v\n",<-perYearChannel)
		result[stockTemp.Times-1] = <- totalChannel
		
	
		
		//fmt.Printf("slice is %v\n", result[stockTemp.times-1])
		stockTemp.Times--
	}
	return result
}

func Iterations( stockTemp Stock, totalChannel chan []float64){
	
	perYearChannel := make(chan float64)
	go RandomReturn(stockTemp, perYearChannel)
	perYearSlice :=make([]float64, stockTemp.Years)
	for stockTemp.Years>0 {
		tempYearRate := <- perYearChannel
		//fmt.Printf("Hi x is %v return is %v\n", years, tempYearRate)
		perYearSlice[stockTemp.Years-1] = tempYearRate
		stockTemp.Years--
	}
	//fmt.Printf("for loop finished\n")
	//fmt.Printf("slice is %v", perYearSlice)
	totalChannel <- perYearSlice
}

func RandomReturn(stockTemp Stock, perYearChannel chan float64){
	
	for i:=0;i<stockTemp.Years;i++ {
		temp := StatUtil.InverseNormalDist(r.Float64(), stockTemp.Mean, stockTemp.Stdv)
		//fmt.Println(temp)
		perYearChannel <- temp
	}
}