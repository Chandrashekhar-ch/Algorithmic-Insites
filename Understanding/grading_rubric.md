# Algorithm Insights - Grading Rubric

## Assignment Overview
Students analyze algorithmic complexity by running the provided C++ program with various input sizes and distributions, then write a 2-page analysis report with visualizations.

## Total Points: 100

### 1. Program Execution & Data Collection (25 points)

#### Excellent (23-25 points)
- ✅ Program compiled and ran successfully
- ✅ Tested multiple input sizes (at least 4 different sizes)
- ✅ Tested multiple data distributions (random, sorted, reverse, nearly-sorted)
- ✅ Collected comprehensive timing and operation count data
- ✅ Systematic data recording (clear tables or CSV format)

#### Good (18-22 points)  
- ✅ Program ran successfully
- ✅ Tested at least 3 input sizes
- ✅ Tested at least 2 data distributions
- ✅ Collected most timing data with minor gaps
- ✅ Generally organized data collection

#### Satisfactory (13-17 points)
- ✅ Program ran with some difficulty
- ✅ Tested limited input sizes (2-3)
- ✅ Limited distribution testing
- ✅ Incomplete data collection
- ⚠️ Disorganized data presentation

#### Needs Improvement (0-12 points)
- ❌ Failed to run program successfully
- ❌ Insufficient testing
- ❌ Little to no data collected
- ❌ Poor organization

### 2. Written Analysis (35 points)

#### Theoretical vs Observed Performance (15 points)
**Excellent (13-15):** Clear explanation of how measurements align with or differ from theoretical complexity. Discusses specific algorithms and their growth patterns.

**Good (10-12):** Generally accurate comparison with minor gaps in understanding.

**Satisfactory (7-9):** Basic comparison with limited depth.

**Needs Improvement (0-6):** Inaccurate or missing theoretical comparison.

#### Real-World Factors Discussion (10 points)
**Excellent (9-10):** Insightful analysis of constant factors, cache effects, compiler optimizations, and input distribution impacts.

**Good (7-8):** Good understanding of most practical factors.

**Satisfactory (5-6):** Basic awareness of real-world considerations.

**Needs Improvement (0-4):** Little understanding of practical factors.

#### Algorithm-Specific Analysis (10 points)
**Excellent (9-10):** Detailed discussion of pivot choice in QuickSort, comparison of recursion strategies, search algorithm efficiency, etc.

**Good (7-8):** Good coverage of most algorithm-specific topics.

**Satisfactory (5-6):** Basic algorithm analysis.

**Needs Improvement (0-4):** Superficial or missing algorithm analysis.

### 3. Data Visualization (25 points)

#### Plot Quality and Clarity (15 points)
**Excellent (13-15):** 
- Clear, well-labeled plots showing n vs time relationships
- Appropriate scale choices (linear vs logarithmic)
- Multiple algorithms compared on same plots
- Professional appearance

**Good (10-12):** Most plots are clear with minor labeling issues.

**Satisfactory (7-9):** Basic plots that convey main ideas.

**Needs Improvement (0-6):** Unclear, mislabeled, or missing plots.

#### Insight from Visualizations (10 points)
**Excellent (9-10):** Plots clearly demonstrate algorithmic complexity differences and support written analysis.

**Good (7-8):** Plots generally support analysis with minor gaps.

**Satisfactory (5-6):** Basic visualization of data trends.

**Needs Improvement (0-4):** Plots don't support or contradict analysis.

### 4. Critical Thinking & Conclusions (15 points)

#### Analysis of Discrepancies (8 points)
**Excellent (7-8):** Thoughtful explanation of why practice differs from theory (cache effects, constants, small input sizes, etc.).

**Good (5-6):** Good understanding of some discrepancies.

**Satisfactory (3-4):** Basic awareness of theory vs practice differences.

**Needs Improvement (0-2):** No recognition or poor explanation of discrepancies.

#### Practical Implications (7 points)
**Excellent (6-7):** Clear discussion of when to choose different algorithms in real applications.

**Good (4-5):** Good understanding of practical algorithm selection.

**Satisfactory (2-3):** Basic awareness of practical considerations.

**Needs Improvement (0-1):** No practical insights provided.

## Bonus Points (up to 10 additional points)

- **Advanced Analysis (5 points):** Memory usage comparison, recursion depth testing, hash collision analysis, BST balance impact
- **Creative Visualization (3 points):** Innovative plots or interactive visualizations  
- **Extended Testing (2 points):** Testing with very large datasets or additional algorithms

## Common Deductions

### Technical Issues (-5 to -10 points)
- Program compilation errors due to student modification
- Incomplete data due to technical problems that could have been resolved
- Poor file organization or missing deliverables

### Academic Integrity (-10 to -50 points)
- Suspected data fabrication
- Copied analysis from other students
- Use of unauthorized external analysis tools without attribution

## Sample Comments for Different Performance Levels

### Excellent Work
*"Outstanding analysis that clearly demonstrates understanding of algorithmic complexity. Your visualizations effectively show the dramatic differences between O(n²) and O(n log n) algorithms, and your discussion of cache effects and compiler optimizations shows sophisticated understanding of real-world performance factors."*

### Good Work  
*"Solid analysis with good data collection and clear plots. Your comparison of theoretical vs observed performance is accurate. Consider discussing why insertion sort might outperform merge sort for very small arrays, and elaborate on the impact of input distribution on QuickSort performance."*

### Needs Improvement
*"Basic data collection but analysis lacks depth. Your plots show the timing differences but you need to connect these observations to the theoretical complexity classes. Explain why bubble sort becomes unusable for large inputs while binary search remains fast."*

## Expected Learning Outcomes

Students should demonstrate:

1. **Empirical Algorithm Analysis:** Ability to measure and compare algorithm performance systematically

2. **Theory-Practice Connection:** Understanding how theoretical complexity relates to real-world performance

3. **Data Visualization Skills:** Creating clear, informative plots that support analytical conclusions

4. **Critical Thinking:** Explaining discrepancies between theory and practice due to implementation factors

5. **Practical Application:** Making informed decisions about algorithm selection based on performance characteristics

## Instructor Notes

- **Timing Variability:** Expect timing measurements to vary between students due to different hardware. Focus on growth patterns rather than absolute values.

- **Compiler Optimizations:** Results may vary significantly with different optimization flags. Ensure all students use the same compilation command.

- **Input Size Limitations:** Some students may not be able to test very large inputs due to hardware constraints. This is acceptable as long as they test within their system's capabilities.

- **Platform Differences:** Results may differ between Windows, Linux, and macOS due to different memory management and scheduling. This can be a good discussion point about cross-platform performance.