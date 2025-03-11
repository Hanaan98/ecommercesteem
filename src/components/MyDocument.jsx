import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../assets/cIRCULAR.png";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    flexDirection: "column",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 70,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  logo: { width: 70, height: 70 },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightHeader: {},
  divider: { borderBottom: "1px solid #c4cbd3" },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  leftSummary: {
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row", // Makes each row a flex row
    justifyContent: "space-between", // Pushes text to both ends
    width: "100%", // Ensures full width usage
    marginBottom: 2, // Adds space between rows
  },
  summaryLabel: {
    fontSize: 11,
    color: "#545454",
    width: "40%", // Controls label width for alignment
  },
  summaryColon: {
    fontSize: 11,
    color: "#000",
    width: "10%", // Fix width for colons so they align
    textAlign: "center", // Centers the colon
  },
  summaryValue: {
    fontSize: 11,
    color: "#000",
    width: "50%", // Ensures consistent spacing
  },

  rightSummary: {
    width: "30%",
    border: "1px solid #c4cbd3",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ffdfdc",
    padding: "5px",
    flexDirection: "row",
    alignItems: "center",
  },
  earnings: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    border: "1px solid #c4cbd3",
    borderRadius: 10,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  totalnet: {
    marginBottom: 20,
    width: "100%",
    border: "1px solid #c4cbd3",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  words: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightBorder: {
    borderLeft: "3px solid #dc3326",
    height: "25px",
    marginRight: 5,
  },
  dottedDivider: {
    borderBottom: "1px dashed #c4cbd3",
    marginBottom: 10,
    marginTop: 5,
  },
});
const numberToWords = (num) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertBelowThousand = (n) => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + convertBelowThousand(n % 100) : "")
    );
  };

  if (num === 0) return "Zero";

  let result = "";
  if (num >= 100000) {
    result += convertBelowThousand(Math.floor(num / 100000)) + " Lac ";
    num %= 100000;
  }
  if (num >= 1000) {
    result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }
  if (num > 0) {
    result += convertBelowThousand(num);
  }

  return result.trim() + " Rupees Only";
};

const MyDocument = ({
  name,
  id,
  payMonth,
  paidOn,
  salary,
  tax,
  netpay,
  extras,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Image style={styles.logo} src={Logo} />
          <View>
            <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
              Ecommercesteem
            </Text>
            <Text style={{ fontSize: "10px", color: "#737373" }}>
              371 C Faisal Town, Lahore
            </Text>
          </View>
        </View>
        <View style={styles.rightHeader}>
          <Text style={{ fontSize: "10px", color: "#737373" }}>
            Payslip for the Month
          </Text>
          <Text style={{ fontSize: "12px", fontWeight: "bold" }}>
            {payMonth} 2025
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.summary}>
        <View style={styles.leftSummary}>
          <Text
            style={{
              fontSize: "10px",
              color: "#737373",
              fontWeight: "bold",
              marginBottom: 6,
            }}
          >
            EMPLOYEE SUMMARY
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Employee Name</Text>
            <Text style={styles.summaryColon}>:</Text>
            <Text style={styles.summaryValue}>{name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Employee ID</Text>
            <Text style={styles.summaryColon}>:</Text>
            <Text style={styles.summaryValue}>{id}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pay Month</Text>
            <Text style={styles.summaryColon}>:</Text>
            <Text style={styles.summaryValue}>{payMonth} 2025</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paid On</Text>
            <Text style={styles.summaryColon}>:</Text>
            <Text style={styles.summaryValue}>{paidOn}</Text>
          </View>
        </View>
        <View style={styles.rightSummary}>
          <View
            style={{
              backgroundColor: "#ffdfdc",
              padding: "5px",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.rightBorder} />
            <View style={{ padding: "5px" }}>
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                Rs. {netpay}
              </Text>
              <Text style={{ fontSize: "11px", color: "#dc3326" }}>
                Total Net Pay
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.earnings}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "50%",
              padding: 20,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
                EARNINGS
              </Text>
              <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
                AMOUNT
              </Text>
            </View>
            <View style={styles.dottedDivider} />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: "10px" }}>Basic</Text>
                <Text style={{ fontSize: "10px" }}>{salary}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <Text style={{ fontSize: "10px" }}>Extras</Text>
                <Text style={{ fontSize: "10px" }}>{extras}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "50%",
              padding: 20,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
                DEDUCTIONS
              </Text>
              <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
                AMOUNT
              </Text>
            </View>
            <View style={styles.dottedDivider} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: "10px" }}>Income Tax</Text>
              <Text style={{ fontSize: "10px" }}>{tax}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            marginTop: 10,
            justifyContent: "space-between",
            backgroundColor: "#ffdfdc",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "50%",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
              Gross Earnings
            </Text>
            <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
              Rs. {parseFloat(salary) + parseFloat(extras)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "50%",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
              Total Deductions
            </Text>
            <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
              Rs. {tax}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.totalnet}>
        <View
          style={{ flexDirection: "column", gap: 3, paddingHorizontal: 20 }}
        >
          <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
            TOTAL NET PAYABLE
          </Text>
          <Text style={{ fontSize: "10px" }}>
            Gross Earnings - Total Deductions
          </Text>
        </View>
        <View style={{ padding: 3 }}>
          <View
            style={{
              padding: 20,
              backgroundColor: "#ffdfdc",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: "15px", fontWeight: "bold" }}>
              Rs. {netpay}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-end", // Pushes content to the right
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: "11px" }}>Amount In words : </Text>
          <Text style={{ fontSize: "11px", fontWeight: "bold" }}>
            {numberToWords(netpay)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />
      <View style={{ marginTop: 30, width: "100%" }}>
        <Text style={{ fontSize: 10, color: "#737373", textAlign: "center" }}>
          --This is a system-generated document. No signature required--
        </Text>
      </View>
    </Page>
  </Document>
);
export default MyDocument;
