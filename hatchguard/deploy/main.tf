# Sprint 6, ticket HG-19 (optional): one small cloud deployment, created and destroyed by code.
# Azure Container Apps example. Fill in the image you pushed. Run: terraform init, plan, apply. Then DESTROY.
terraform {
  required_providers { azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" } }
}
provider "azurerm" { features {} }

variable "image" { type = string }                # e.g. ghcr.io/<you>/hatchguard:0.1.0
variable "anthropic_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-hatchguard-dev"
  location = "germanywestcentral"
}
resource "azurerm_log_analytics_workspace" "logs" {
  name                = "log-hatchguard-dev"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  retention_in_days   = 30
}
resource "azurerm_container_app_environment" "env" {
  name                       = "cae-hatchguard-dev"
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
}
resource "azurerm_container_app" "api" {
  name                         = "ca-hatchguard-api"
  resource_group_name          = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"
  secret {
    name  = "anthropic-key"
    value = var.anthropic_api_key
  }
  template {
    min_replicas = 0                              # scale to zero: no traffic, no cost
    max_replicas = 1
    container {
      name   = "api"
      image  = var.image
      cpu    = 0.5
      memory = "1Gi"
      env {
        name        = "ANTHROPIC_API_KEY"
        secret_name = "anthropic-key"
      }
    }
  }
  ingress {
    external_enabled = true
    target_port      = 8000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
output "url" { value = "https://${azurerm_container_app.api.ingress[0].fqdn}" }
