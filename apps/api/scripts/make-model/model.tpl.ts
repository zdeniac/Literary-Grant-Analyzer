model {{ modelName }} {
  id  Int  @id  @default(autoincrement())
	
{{ fieldList }}

{{ auditFields }}
}
